import { AuthLayout } from '@layouts/auth/auth-layout';
import { LoginView } from '@screens/auth/login-view';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <AuthLayout title="Entrar">
      <LoginView />
    </AuthLayout>
  );
}
