import LoginBrandPanel from "../components/dashboard/login/LoginBrandPanel ";
import LoginForm from "../components/dashboard/login/LoginForm";

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen w-full">
        <LoginBrandPanel />
        <section className="flex min-h-screen flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:px-14 xl:px-20">
          <LoginForm />
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
