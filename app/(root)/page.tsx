import Link from "next/link";

export default async function Login() {  

  return (
    <div className="landing-page-container">
      <div className="header">
        <h1 className="title">SDT</h1>
        <p className="subtitle">Seguimiento de Trámites.</p>
      </div>

      <div className="content">
        <h2 className="content-title">Bienvenido</h2>
        <p className="content-description">
          Nos especializamos en la gestión de recursos humanos de tu empresa.
        </p>
        <Link className="login-button" href="/login">Iniciar Sesión</Link>        
      </div>

      <div className="footer">
        <p className="footer-text">© 2025 Maroargo | All rights reserved.</p>
      </div>
    </div>   
  );
}
