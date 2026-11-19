// Lit le contenu (payload) du token JWT : { us_id, us_username, us_email, us_role }
export function readToken(token) {
    return JSON.parse(atob(token.split(".")[1]));
}
