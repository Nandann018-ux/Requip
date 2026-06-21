import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box, Grid, TextField, Button, Typography, CircularProgress,
} from '@mui/material'
import { CheckCircleOutline, ArrowBack, LockOutlined } from '@mui/icons-material'
import type { CreateUserPayload } from '../types/user'

const userSchema = z.object({
  firstName: z.string().min(1, 'Required').max(100),
  lastName: z.string().min(1, 'Required').max(100),
  email: z.string().email('Enter a valid email address'),
  primaryMobile: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile (starts 6-9)'),
  secondaryMobile: z
    .string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit Indian mobile (starts 6-9)').optional().or(z.literal('')),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Exactly 12 digits required'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Format: ABCDE1234F'),
  dateOfBirth: z.string().refine((val) => {
    const d = new Date(val)
    return !isNaN(d.getTime()) && d < new Date()
  }, 'Must be a past date'),
  placeOfBirth: z.string().min(1, 'Required').max(100),
  currentAddress: z.string().min(1, 'Required'),
  permanentAddress: z.string().min(1, 'Required'),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: CreateUserPayload) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEditMode?: boolean
}

const IMMUTABLE = ['email', 'aadhaarNumber', 'panNumber']

function SectionHeader({ label, sublabel, locked }: { label: string; sublabel?: string; locked?: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#0F172A', letterSpacing: '-0.005em' }}>
          {label}
        </Typography>
        {sublabel && (
          <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', mt: 0.25 }}>{sublabel}</Typography>
        )}
      </Box>
      {locked && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', px: 1, py: 0.375 }}>
          <LockOutlined sx={{ fontSize: 11, color: '#D97706' }} />
          <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, color: '#D97706', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Immutable
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default function UserForm({ defaultValues, onSubmit, onCancel, isLoading = false, isEditMode = false }: UserFormProps) {
  const { control, handleSubmit, formState: { errors, isDirty } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', primaryMobile: '',
      secondaryMobile: '', aadhaarNumber: '', panNumber: '',
      dateOfBirth: '', placeOfBirth: '', currentAddress: '', permanentAddress: '',
      ...defaultValues,
    },
  })

  const handleFormSubmit = async (data: UserFormData) => {
    await onSubmit({ ...data, secondaryMobile: data.secondaryMobile || undefined })
  }

  const field = (name: keyof UserFormData, label: string, extra: Record<string, unknown> = {}) => (
    <Controller
      name={name}
      control={control}
      render={({ field: f }) => (
        <TextField
          {...f}
          {...extra}
          label={label}
          fullWidth
          size="small"
          error={!!errors[name]}
          helperText={errors[name]?.message}
          disabled={isLoading || (isEditMode && IMMUTABLE.includes(name))}
          sx={{
            ...(isEditMode && IMMUTABLE.includes(name) ? {
              '& .MuiOutlinedInput-root': {
                bgcolor: '#FAFAFA',
                '& fieldset': { borderColor: '#E8E9F0', borderStyle: 'dashed' },
              },
              '& .MuiInputBase-input': { color: '#94A3B8' },
            } : {}),
          }}
        />
      )}
    />
  )

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      {/* Section 1 — Personal */}
      <Box
        sx={{
          p: 3, mb: 2, borderRadius: '10px',
          border: '1px solid #E8E9F0', bgcolor: '#FAFBFF',
        }}
      >
        <SectionHeader label="Personal Information" sublabel="Basic details about the user" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>{field('firstName', 'First Name *')}</Grid>
          <Grid item xs={12} sm={6}>{field('lastName', 'Last Name *')}</Grid>
          <Grid item xs={12} sm={6}>
            {field('dateOfBirth', 'Date of Birth *', { type: 'date', InputLabelProps: { shrink: true } })}
          </Grid>
          <Grid item xs={12} sm={6}>{field('placeOfBirth', 'Place of Birth *')}</Grid>
        </Grid>
      </Box>

      {/* Section 2 — Contact */}
      <Box sx={{ p: 3, mb: 2, borderRadius: '10px', border: '1px solid #E8E9F0', bgcolor: '#FAFBFF' }}>
        <SectionHeader label="Contact Details" sublabel="How to reach the user" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {field('email', 'Email Address *', { type: 'email' })}
          </Grid>
          <Grid item xs={12} sm={6}>
            {field('primaryMobile', 'Primary Mobile *', { inputProps: { maxLength: 10 } })}
          </Grid>
          <Grid item xs={12} sm={6}>
            {field('secondaryMobile', 'Secondary Mobile', { inputProps: { maxLength: 10 } })}
          </Grid>
        </Grid>
      </Box>

      {/* Section 3 — Identity */}
      <Box sx={{ p: 3, mb: 2, borderRadius: '10px', border: '1px solid #E8E9F0', bgcolor: '#FAFBFF' }}>
        <SectionHeader
          label="Identity Documents"
          sublabel="Government-issued identifiers — cannot be changed after creation"
          locked={isEditMode}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {field('aadhaarNumber', 'Aadhaar Number *', { inputProps: { maxLength: 12 }, sx: { '& input': { fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.1em' } } })}
          </Grid>
          <Grid item xs={12} sm={6}>
            {field('panNumber', 'PAN Number *', { inputProps: { maxLength: 10, style: { textTransform: 'uppercase', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.08em' } } })}
          </Grid>
        </Grid>
      </Box>

      {/* Section 4 — Address */}
      <Box sx={{ p: 3, mb: 3, borderRadius: '10px', border: '1px solid #E8E9F0', bgcolor: '#FAFBFF' }}>
        <SectionHeader label="Address" sublabel="Current and permanent residence" />
        <Grid container spacing={2}>
          <Grid item xs={12}>{field('currentAddress', 'Current Address *', { multiline: true, rows: 2 })}</Grid>
          <Grid item xs={12}>{field('permanentAddress', 'Permanent Address *', { multiline: true, rows: 2 })}</Grid>
        </Grid>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pt: 1 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          disabled={isLoading}
          startIcon={<ArrowBack sx={{ fontSize: '15px !important' }} />}
          size="small"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading || (isEditMode && !isDirty)}
          size="small"
          startIcon={
            isLoading
              ? <CircularProgress size={14} color="inherit" />
              : <CheckCircleOutline sx={{ fontSize: '16px !important' }} />
          }
          sx={{ minWidth: 130 }}
        >
          {isLoading ? 'Saving…' : isEditMode ? 'Save Changes' : 'Create User'}
        </Button>
      </Box>
    </Box>
  )
}
