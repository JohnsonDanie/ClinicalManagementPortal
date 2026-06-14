module.exports = async (req, res) => {
  const urlPath = req.url;
  console.log(`[Keycloak Proxy] Received request for path: ${urlPath}`);

  // 1. Authorization Endpoint Proxy (302 Redirect to CampusOne)
  if (urlPath.includes('/protocol/openid-connect/auth')) {
    const queryStr = urlPath.split('?')[1] || '';
    
    // Sanitize parameters to remove any accidental newlines or carriage returns (\r, \n, %0A, %0D)
    // that might corrupt the redirection or header content.
    const params = new URLSearchParams(queryStr);
    const sanitizedParams = new URLSearchParams();
    for (const [key, value] of params.entries()) {
      const cleanKey = key.trim();
      const cleanValue = value.replace(/\r?\n|\r/g, '').trim();
      sanitizedParams.append(cleanKey, cleanValue);
    }
    const query = sanitizedParams.toString();

    const redirectUrl = `https://auth.campusone.com.ng/api/auth/oauth2/authorize?${query}`;
    console.log(`[Keycloak Proxy] Redirecting user to: ${redirectUrl}`);
    res.writeHead(302, { Location: redirectUrl });
    res.end();
    return;
  }

  // 2. Token Endpoint Proxy (Forward POST request to CampusOne)
  if (urlPath.includes('/protocol/openid-connect/token')) {
    try {
      let body = '';
      if (req.method === 'POST') {
        body = await new Promise((resolve) => {
          let chunks = [];
          req.on('data', chunk => chunks.push(chunk));
          req.on('end', () => resolve(Buffer.concat(chunks)));
        });
      }

      console.log(`[Keycloak Proxy] Forwarding token request to CampusOne...`);
      const response = await fetch('https://auth.campusone.com.ng/api/auth/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Authorization': req.headers['authorization'] || ''
        },
        body: body
      });

      const resBody = await response.text();
      console.log(`[Keycloak Proxy] Token response status: ${response.status}`);
      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(resBody);
      return;
    } catch (err) {
      console.error('[Keycloak Proxy] Token exchange error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Token proxy failed', details: err.message }));
      return;
    }
  }

  // 3. UserInfo Endpoint Proxy (Forward GET request to CampusOne)
  if (urlPath.includes('/protocol/openid-connect/userinfo')) {
    try {
      console.log(`[Keycloak Proxy] Forwarding userinfo request to CampusOne...`);
      const response = await fetch('https://auth.campusone.com.ng/api/auth/oauth2/userinfo', {
        method: 'GET',
        headers: {
          'Authorization': req.headers['authorization'] || ''
        }
      });

      const resBody = await response.text();
      console.log(`[Keycloak Proxy] Userinfo response status: ${response.status}`);
      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(resBody);
      return;
    } catch (err) {
      console.error('[Keycloak Proxy] Userinfo error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Userinfo proxy failed', details: err.message }));
      return;
    }
  }

  // 4. Certs/JWKS Endpoint Proxy (Forward GET request to CampusOne JWKS)
  // This is critical for Supabase Auth to fetch signing keys and verify ID tokens.
  if (urlPath.includes('/protocol/openid-connect/certs')) {
    try {
      console.log(`[Keycloak Proxy] Forwarding certs request to CampusOne JWKS...`);
      const response = await fetch('https://auth.campusone.com.ng/api/auth/jwks', {
        method: 'GET'
      });

      const resBody = await response.text();
      console.log(`[Keycloak Proxy] Certs response status: ${response.status}`);
      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(resBody);
      return;
    } catch (err) {
      console.error('[Keycloak Proxy] Certs proxy error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Certs proxy failed', details: err.message }));
      return;
    }
  }

  // 5. Logout Endpoint Proxy (302 Redirect to CampusOne Sign-Out)
  if (urlPath.includes('/protocol/openid-connect/logout')) {
    const query = urlPath.split('?')[1] || '';
    const redirectUrl = `https://auth.campusone.com.ng/api/auth/sign-out?${query}`;
    console.log(`[Keycloak Proxy] Redirecting logout to: ${redirectUrl}`);
    res.writeHead(302, { Location: redirectUrl });
    res.end();
    return;
  }

  // 6. OpenID Configuration Discovery Endpoint Proxy (Optional, for auto-discovery fallback)
  if (urlPath.includes('/.well-known/openid-configuration')) {
    try {
      console.log(`[Keycloak Proxy] Forwarding discovery config request...`);
      const response = await fetch('https://auth.campusone.com.ng/api/auth/.well-known/openid-configuration', {
        method: 'GET'
      });

      const resBody = await response.text();
      console.log(`[Keycloak Proxy] Discovery config status: ${response.status}`);
      res.writeHead(response.status, { 'Content-Type': 'application/json' });
      res.end(resBody);
      return;
    } catch (err) {
      console.error('[Keycloak Proxy] Discovery config error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Discovery config proxy failed', details: err.message }));
      return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Path not matched by Keycloak Proxy' }));
};
