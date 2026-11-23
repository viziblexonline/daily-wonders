# Auth setup (Email + Google)

## 1. Email / Password (Supabase)

1. Open Supabase → **Authentication → Providers → Email**
2. Enable **Email**
3. Optional: turn **Confirm email** ON/OFF
   - OFF = instant login after signup (easier for testing)

## 2. Redirect URLs

Supabase → **Authentication → URL Configuration**

**Site URL**
```
https://www.dailywonders.co.uk
```

**Redirect URLs** (add all):
```
http://localhost:3000/auth/callback
https://dailywonders.vercel.app/auth/callback
https://www.dailywonders.co.uk/auth/callback
https://dailywonders.co.uk/auth/callback
```

## 3. Google login

### A) Google Cloud Console
1. https://console.cloud.google.com → create/select project
2. **APIs & Services → OAuth consent screen** → External → fill app name
3. **Credentials → Create Credentials → OAuth client ID**
4. Application type: **Web application**
5. Authorized redirect URIs — add your Supabase callback:
```
https://rodnhnjybgikdqfaszim.supabase.co/auth/v1/callback
```
6. Copy **Client ID** + **Client Secret**

### B) Supabase
1. **Authentication → Providers → Google** → Enable
2. Paste Client ID + Client Secret → Save

## 4. Success emails (login / signup)

Emails are sent via **Resend**.

1. Create free account: https://resend.com
2. API Keys → Create → copy key (`re_...`)
3. Add to Vercel → Project → Settings → Environment Variables:
   - `RESEND_API_KEY` = `re_...`
   - `EMAIL_FROM` = `Daily Wonders <onboarding@resend.dev>` (test)
4. Redeploy

> With `onboarding@resend.dev` you can only send to **your Resend account email** until you verify your domain (e.g. `noreply@dailywonders.co.uk`).

## 5. Test
- `/signup` → email + password → success banner + inbox email
- `/login` → email + password → success banner + inbox email
- **Continue with Google** → same
