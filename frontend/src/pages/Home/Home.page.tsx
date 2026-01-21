import UserDropdown from '@/components/UserDropdown';

const HomePage = () => {
  return (
    <div className="flex w-fit flex-col gap-8 p-8">
      <p>Home page</p>
      <UserDropdown />
    </div>
  );
};

export default HomePage;
