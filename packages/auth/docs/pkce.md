# 🔑 PKCE (Proof Key for Code Exchange) Support

Proof Key for Code Exchange (PKCE, pronounced "pixy") is a security extension for OAuth 2.0 that prevents authorization code injection and interception attacks. While originally designed for mobile apps, it is now a best practice for all "Public Clients" (including Single Page Apps) and is highly recommended even for Confidential Clients.

## 1. The Strategy: The "Secret Handshake" (S256)

PKCE works by having the client generate a "one-time secret" that it proves it knows at the start and end of the flow.

### The Component Parts
1.  **Code Verifier**: A random, high-entropy string (`[A-Z], [a-z], [0-9], -, ., _, ~`).
2.  **Code Challenge**: A SHA-256 hash of the verifier, Base64Url encoded.
3.  **Code Challenge Method**: Always `S256` in our ecosystem.

### The Flow (Step-by-Step)

1.  **Preparation**: The Client SDK generates a random `code_verifier`.
2.  **Challenge**: The Client SDK hashes the verifier to create the `code_challenge`.
3.  **Persistence**: The `code_verifier` is stored in a short-lived, encrypted, `httpOnly` cookie.
4.  **Handoff**: The User is redirected to the Account Center with the challenge:
    `?code_challenge=B4ck...&code_challenge_method=S256`
5.  **Authorize**: The Account Center stores the `code_challenge` and `method` alongside the `code` it issues.
6.  **Exchange**: When the Client App swaps the `code` for a `token`, it sends the original `code_verifier`.
7.  **Proof**: The Account Center hashes the incoming `code_verifier` and compares it to the stored `code_challenge`.

---

## 2. Implementation: Client (SDK / `auth-nextjs`)

The SDK provides utilities to generate and verify these values.

### Step A: Initiate PKCE
In the `redirectToLogin` method:
```typescript
import { generateCodeVerifier, generateCodeChallenge } from "@mayrlabs/auth";

const verifier = generateCodeVerifier(); // 64 chars
const challenge = await generateCodeChallenge(verifier);

// Store verifier in cookie
cookies().set("mayrlabs-auth-verifier", verifier, { httpOnly: true, maxAge: 300 });

// Redirect with challenge
url.searchParams.set("code_challenge", challenge);
url.searchParams.set("code_challenge_method", "S256");
```

### Step B: The Exchange
In the `handleCallback` method, the SDK retrieves the verifier and passes it to the token endpoint.
```typescript
const verifier = cookies().get("mayrlabs-auth-verifier")?.value;
// Send verifier to /api/auth/token endpoint
```

---

## 3. Implementation: Issuer (Account App)

The Account App is responsible for enforcing the PKCE contract.

### Step A: Authorization
When a request arrives at `/login` or `/authorize`:
1.  Accept `code_challenge` and `code_challenge_method`.
2.  Validate that `method` is `S256`.
3.  Store these values in your database or session linked to the authorization `code` you are about to issue.

### Step B: Token Verification (`/api/auth/token`)
When the client exchanges the code for a token:
1.  Look up the `code_challenge` associated with the provided `code`.
2.  Receive the `code_verifier` from the POST body.
3.  **The Proof**:
    ```typescript
    const hash = crypto.createHash('sha256').update(code_verifier).digest('base64url');
    if (hash !== storedChallenge) {
      throw new Error("PKCE Verification Failed");
    }
    ```

---

## 4. Why PKCE is Vital

Even if hackers are using a "Man-in-the-middle" attack or intercepting the redirect URL to steal the `auth_code` (the ticket), they cannot use it. 

To use the `auth_code`, they must provide the `code_verifier`. Since the `code_verifier` was only stored in a `httpOnly` cookie on the *real* app's domain, the hacker never sees it. Without the verifier, they cannot pass the "Secret Handshake."

## 5. Summary for Developers

| Phase | Client (SDK) | Issuer (Account App) |
| :--- | :--- | :--- |
| **Login** | Create verifier + challenge. Store verifier in cookie. | Receive and store challenge. |
| **Exchange** | Send verifier with the `code`. | Hash incoming verifier. Compare with stored challenge. |

**If the hashes do not match, the token MUST NOT be issued.**
