-- ============================================================
-- Clarix Initial Schema
-- Run this in your Supabase project's SQL editor.
-- ============================================================

-- Profiles table: extends auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('student', 'parent')),
  full_name   TEXT NOT NULL,
  year_level  INTEGER,          -- students only
  state       TEXT,             -- students only (NSW, VIC, etc.)
  subjects    TEXT[],           -- students only
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Parent-managed children (do not require a separate auth account)
CREATE TABLE IF NOT EXISTS public.parent_children (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_name  TEXT NOT NULL,
  year_level  INTEGER NOT NULL,
  state       TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_children ENABLE ROW LEVEL SECURITY;

-- Profiles: each user can read/update only their own row
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Parent children: parent can CRUD their own children
CREATE POLICY "parent_children_select_own" ON public.parent_children
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "parent_children_insert_own" ON public.parent_children
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "parent_children_update_own" ON public.parent_children
  FOR UPDATE USING (auth.uid() = parent_id);

CREATE POLICY "parent_children_delete_own" ON public.parent_children
  FOR DELETE USING (auth.uid() = parent_id);

-- ============================================================
-- Trigger: auto-create profile stub on user signup
-- (The signup Server Action will UPDATE this with role/name etc.)
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (NEW.id, 'student', COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
