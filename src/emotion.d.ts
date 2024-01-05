import '@emotion/react';
import { Theme as AppTheme } from './styles/theme.style'; // Import your custom theme type

declare module '@emotion/react' {
  export interface Theme extends AppTheme {}
}
