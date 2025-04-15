// import { AuthProvider } from "../context/AuthContext";
import { PreviewProvider } from "../context/PreviewContext";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <PreviewProvider>
        <Component {...pageProps} />
      </PreviewProvider>
    </AuthProvider>
  );
}

export default MyApp;
