import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material'
import { Save, Cancel } from '@mui/icons-material'
import type { CreateUserPayload } from '../types/user'

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  primaryMobile: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number'),
  secondaryMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number')
    .optional()
    .or(z.literal('')),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar must be exactly 12 digits'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN must be in format: ABCDE1234F'),
  dateOfBirth: z.string().refine((val) => {
    const date = new Date(val)
    return !isNaN(date.getTime()) && date < new Date()
  }, 'Date of birth must be a valid past date'),
  placeOfBirth: z.string().min(1, 'Place of birth is required').max(100),
  currentAddress: z.string().min(1, 'Current address is required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: CreateUserPayload) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  isEditMode?: boolean
}

const IMMUTABLE_FIELDS = ['email', 'aadhaarNumber', 'panNumber']

export default function UserForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditMode = false,
}: UserFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      primaryMobile: '',
      secondaryMobile: '',
      aadhaarNumber: '',
      panNumber: '',
      dateOfBirth: '',
      placeOfBirth: '',
      currentAddress: '',
      permanentAddress: '',
      ...defaultValues,
    },
  })

  const handleFormSubmit = async (data: UserFormData) => {
    const payload: CreateUserPayload = {
      ...data,
      secondaryMobile: data.secondaryMobile || undefined,
    }
    await onSubmit(payload)
  }

  const renderField = (
    name: keyof UserFormData,
    label: string,
    extra: Record<string, unknown> = {},
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          {...extra}
          label={label}
          fullWidth
          size="small"
          error={!!errors[name]}
          helperText={errors[name]?.message}
          disabled={isLoading || (isEditMode && IMMUTABLE_FIELDS.includes(name))}
        />
      )}
    />
  )

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Personal Information
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>{renderField('firstName', 'First Name *')}</Grid>
        <Grid item xs={12} sm={6}>{renderField('lastName', 'Last Name *')}</Grid>
        <Grid item xs={12} sm={6}>{renderField('email', 'Email Address *', { type: 'email' })}</Grid>
        <Grid item xs={12} sm={6}>{renderField('dateOfBirth', 'Date of Birth *', { type: 'date', InputLabelProps: { shrink: true } })}</Grid>
        <Grid item xs={12} sm={6}>{renderField('placeOfBirth', 'Place of Birth *')}</Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Contact Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>{renderField('primaryMobile', 'Primary Mobile *', { inputProps: { maxLength: 10 } })}</Grid>
        <Grid item xs={12} sm={6}>{renderField('secondaryMobile', 'Secondary Mobile (optional)', { inputProps: { maxLength: 10 } })}</Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Identity Documents
        {isEditMode && (
          <Typography component="span" variant="caption" color="text.secondary" ml={1}>
            (Immutable after creation)
          </Typography>
        )}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>{renderField('aadhaarNumber', 'Aadhaar Number *', { inputProps: { maxLength: 12 } })}</Grid>
        <Grid item xs={12} sm={6}>{renderField('panNumber', 'PAN Number *', { inputProps: { maxLength: 10, style: { textTransform: 'uppercase' } } })}</Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Address
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>{renderField('currentAddress', 'Current Address *', { multiline: true, rows: 2 })}</Grid>
        <Grid item xs={12}>{renderField('permanentAddress', 'Permanent Address *', { multiline: true, rows: 2 })}</Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button startIcon={<Cancel />} onClick={onCancel} variant="outlined" disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : <Save />}
          variant="contained"
          disabled={isLoading || (isEditMode && !isDirty)}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create User'}
        </Button>
      </Box>
    </Box>
  )
}
