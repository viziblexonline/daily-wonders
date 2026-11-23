# Auth setup (Email + Google) — no Resend needed

Emails go through **Supabase Auth** (free built-in mailer).

## 1. Enable Email provider

Authentication → Providers → **Email** → ON

## 2. Turn ON Confirm email (signup success mail)

Authentication → Providers → **Email** → **Confirm email** → **ON** → Save

Signup pe user ko Supabase se confirmation / welcome email jayegi.

## 3. Customize email messages

Authentication → **Email Templates**

### Confirm signup (signup success)
- **Subject:** `Welcome to Daily Wonders — account created`
- **Body:** apna welcome text + confirm link (link zaroori hai)

### Magic Link (login success mail)
Login ke baad app Magic Link email bhejti hai. Template change karo:
- **Subject:** `Login successful — Daily Wonders`
- **Body:**  
  `You successfully signed in to Daily Wonders. If this wasn't you, reset your password.`  
  (neeche wala link rehne do)

## 4. Redirect URLs

Authentication → URL Configuration

Site URL:
```
https://www.dailywonders.co.uk
```

Redirect URLs:
```
http://localhost:3000/auth/callback
https://daily-wonders.vercel.app/auth/callback
https://www.dailywonders.co.uk/auth/callback
https://dailywonders.co.uk/auth/callback
```

## 5. Google (optional)

Providers → Google → Client ID + Secret  
Redirect in Google Cloud:
```
https://rodnhnjybgikdqfaszim.supabase.co/auth/v1/callback
```
