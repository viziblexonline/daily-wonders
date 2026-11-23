# Paste these into Supabase → Authentication → Email Templates

## Confirm signup

**Subject**
```
Welcome to Daily Wonders — account created successfully
```

**Body**
```html
<h2>You're in.</h2>
<p>Hi there,</p>
<p>Your Daily Wonders account was created successfully.</p>
<p>Confirm your email to start shopping premium protein & supplements:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>— Daily Wonders</p>
```

## Magic Link (used as login success email)

**Subject**
```
Login successful — Daily Wonders
```

**Body**
```html
<h2>Login successful</h2>
<p>You just signed in to Daily Wonders.</p>
<p>If this was you, you can ignore this email or open your account:</p>
<p><a href="{{ .ConfirmationURL }}">Open my account</a></p>
<p>If this wasn't you, reset your password immediately.</p>
<p>— Daily Wonders</p>
```
