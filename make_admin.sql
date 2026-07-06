-- Run this in Supabase SQL Editor.
-- Replace the email below with the email of the user who already exists
-- in Authentication -> Users.

insert into admin_users (id, email)
select id, email
from auth.users
where email = 'admin@example.com'
on conflict (id) do nothing;
