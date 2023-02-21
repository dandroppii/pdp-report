import { FlexRowCenter } from 'components/flex-box';
import SEO from 'components/SEO';
import { useAuthContext } from 'contexts/AuthContext';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Login from 'pages-sections/sessions/Login';
import { useEffect } from 'react';

const LoginPage: NextPage = () => {
  const { isLogin } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    isLogin && router.push('/');
  }, [router, isLogin]);
  return (
    <FlexRowCenter flexDirection="column" minHeight="100vh">
      <SEO title="Login" />
      <Login />
    </FlexRowCenter>
  );
};

export default LoginPage;
