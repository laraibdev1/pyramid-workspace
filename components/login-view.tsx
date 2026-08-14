import { BrandMark } from './ui/brand-mark'

export function LoginView({
  onContinue,
  isLoading,
}: {
  onContinue: () => void
  isLoading: boolean
}) {
  return (
    <main className="login-page">
      <div className="brand-mark">
        <BrandMark size={20} /> Pyramid
      </div>
      <div className="login-card">
        <h1>Let&apos;s get back on track</h1>
        <p>Enter your email below to login to your account.</p>
        <button className="dark-button full" onClick={onContinue} disabled={isLoading}>
          {isLoading ? 'Starting session…' : 'Continue as Guest'}
        </button>
        <button className="google-button" disabled>
          <strong>G</strong> Login with Google
        </button>
      </div>
      <small>
        By clicking continue, you agree to
        <br />
        our <u>Terms of Service</u> and <u>Privacy
        <br />
        Policy</u>
      </small>
    </main>
  )
}
