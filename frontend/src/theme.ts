import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4338CA',
      light: '#6D63E8',
      dark: '#312E81',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0F172A',
    },
    success: {
      main: '#059669',
      light: '#ECFDF5',
      contrastText: '#065F46',
    },
    error: {
      main: '#DC2626',
      light: '#FEF2F2',
    },
    warning: {
      main: '#D97706',
      light: '#FFFBEB',
    },
    background: {
      default: '#F4F4F6',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#64748B',
      disabled: '#94A3B8',
    },
    divider: '#E8E9F0',
    grey: {
      50: '#F8F9FC',
      100: '#F1F2F8',
      200: '#E8E9F0',
      300: '#D1D3E0',
      400: '#9499B0',
      500: '#6B7180',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Helvetica", "Arial", sans-serif',
    h3: {
      fontFamily: '"Fraunces", Georgia, serif',
      fontWeight: 300,
      fontSize: '2rem',
      letterSpacing: '-0.03em',
      fontStyle: 'italic',
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
      fontSize: '1.625rem',
      letterSpacing: '-0.025em',
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      letterSpacing: '-0.015em',
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      fontSize: '1.0625rem',
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: '0.9375rem',
      letterSpacing: '-0.005em',
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.8125rem',
      letterSpacing: '0.02em',
      textTransform: 'uppercase' as const,
      color: '#9499B0',
    },
    body1: {
      fontSize: '0.9375rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#64748B',
      lineHeight: 1.4,
    },
    button: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      letterSpacing: '0',
      textTransform: 'none' as const,
      fontSize: '0.875rem',
    },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 2px rgba(15,23,42,0.04)',
    '0 1px 4px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
    '0 4px 8px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.04)',
    '0 8px 16px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.04)',
    '0 12px 24px rgba(15,23,42,0.10), 0 6px 8px rgba(15,23,42,0.04)',
    '0 20px 40px rgba(15,23,42,0.12)',
    ...Array(18).fill('none'),
  ] as any,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F4F4F6' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '9px 18px',
          fontSize: '0.875rem',
          lineHeight: 1.4,
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: '0 1px 2px rgba(67,56,202,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(67,56,202,0.35)',
            transform: 'translateY(-1px)',
          },
          '&:active': { transform: 'translateY(0)' },
        },
        outlined: {
          borderColor: '#D1D3E0',
          color: '#374151',
          '&:hover': {
            borderColor: '#4338CA',
            color: '#4338CA',
            backgroundColor: '#F5F4FF',
          },
        },
        sizeSmall: { padding: '6px 14px', fontSize: '0.8125rem' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 12,
          border: '1px solid #E8E9F0',
          boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
        },
        elevation0: { boxShadow: 'none', border: '1px solid #E8E9F0' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          backgroundImage: 'none',
          borderBottom: '1px solid #E8E9F0',
          boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
          color: '#0F172A',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F8F9FC',
            color: '#6B7180',
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            borderBottom: '1px solid #E8E9F0',
            padding: '11px 16px',
            fontFamily: '"Outfit", sans-serif',
            whiteSpace: 'nowrap',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.1s ease',
          '&:hover': { backgroundColor: '#F8F9FC' },
          '&:last-child td, &:last-child th': { border: 0 },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: '#F1F2F8',
          padding: '13px 16px',
          fontSize: '0.875rem',
          color: '#374151',
          verticalAlign: 'middle',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: '1px solid #F1F2F8',
          color: '#64748B',
          fontSize: '0.8125rem',
        },
        selectLabel: { fontSize: '0.8125rem' },
        displayedRows: { fontSize: '0.8125rem' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#FAFAFA',
            fontSize: '0.9rem',
            transition: 'all 0.15s ease',
            '& fieldset': { borderColor: '#D1D3E0' },
            '&:hover fieldset': { borderColor: '#9499B0' },
            '&.Mui-focused': {
              backgroundColor: '#FFFFFF',
              '& fieldset': { borderColor: '#4338CA', borderWidth: 2 },
            },
            '&.Mui-disabled': { backgroundColor: '#F8F9FC' },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.9rem',
            color: '#64748B',
            '&.Mui-focused': { color: '#4338CA' },
          },
          '& .MuiFormHelperText-root': { fontSize: '0.75rem', marginTop: 4 },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          fontSize: '0.72rem',
          borderRadius: 5,
          height: 22,
          letterSpacing: '0.01em',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 25px 60px rgba(15,23,42,0.18)',
          border: '1px solid #E8E9F0',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: '1.0625rem', fontWeight: 700, padding: '20px 24px 12px' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#F1F2F8' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.15s ease',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#0F172A',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: 6,
          padding: '5px 10px',
        },
        arrow: { color: '#0F172A' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '0.875rem' },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: { fontSize: '0.8125rem', color: '#64748B' },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { borderRadius: 6, backgroundColor: '#EEEEF4' },
      },
    },
  },
})
