-- Run this in Supabase SQL Editor (Project -> SQL Editor -> New query)
-- This creates all tables needed by the app.

create extension if not exists "pgcrypto";

create table if not exists moderator_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone varchar(20) not null,
  email text not null,
  facebook_link text not null,
  address text not null,
  parent_phone varchar(20),
  parent_facebook text,
  school_name text,
  class_name text,
  teacher_name text,
  teacher_phone varchar(20),
  teacher_facebook text,
  id_document_url text not null,
  face_photo_url text not null,
  verification_method text not null,
  status varchar(20) not null default 'Pending',
  admin_note text,
  created_at timestamp not null default now()
);

create table if not exists moderator_rules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  order_index integer not null
);

create table if not exists moderator_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  created_at timestamp not null default now()
);

-- admin_users maps a Supabase Auth user (auth.users.id) to admin access.
-- There is no password stored here — auth is fully handled by Supabase Auth.
-- A row in this table simply means "this authenticated user is allowed
-- into /admin".
create table if not exists admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamp not null default now()
);
