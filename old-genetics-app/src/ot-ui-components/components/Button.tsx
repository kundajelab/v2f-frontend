import { default as MuiButton } from '@mui/material/Button';

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary';
  variant?: 'contained' | 'outlined' | 'text';
};
const Button = ({ children, color, variant, ...rest }: ButtonProps) => (
  <MuiButton
    color={color ? color : 'primary'}
    variant={variant ? variant : 'contained'}
    {...rest}
  >
    {children}
  </MuiButton>
);

export default Button;
