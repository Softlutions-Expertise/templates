import { AuthLayout } from '@layouts/auth/auth-layout';
import { RegisterView } from '@screens/auth/register-view';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <AuthLayout title="Criar Conta">
      <RegisterView />
    </AuthLayout>
  );
}
