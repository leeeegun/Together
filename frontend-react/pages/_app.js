import '../styles/globals.css'
import LoginForm from './components/loginForm'
import SignupForm from './components/signupForm'

function MyApp({ Component, pageProps }) {
  return (
    <main>
      <Component {...pageProps} />
      <hr />
      <LoginForm />
      <hr />
      <SignupForm />
    </main>
  
  )
}

export default MyApp
