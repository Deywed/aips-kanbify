type LogoProps = {
  size?: number;
  className?: string;
};

const Logo = ({ size = 32, className }: LogoProps) => {
  return (
    <img
      src="/images/logo_v1.png"
      alt="VolonTweet Logo"
      className={className}
      width={size}
      height={size}
    />
  );
};

export default Logo;
