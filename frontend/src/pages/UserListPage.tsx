import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination,
  Paper, IconButton, Tooltip, TextField, InputAdornment,
  Chip, Skeleton, Alert, Avatar, Stack,
} from '@mui/material'
import {
  Add, Edit, Delete, Search, Refresh, ClearRounded,
  PersonOutline, EmailOutlined, PhoneOutlined, SearchOff,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { usersApi } from '../api/users.api'
import ConfirmDialog from '../components/ConfirmDialog'
import type { User } from '../types/user'

const AVATAR_COLORS = [
  ['#4338CA', '#EEF2FF'],
  ['#059669', '#ECFDF5'],
  ['#D97706', '#FEF3C7'],
  ['#DC2626', '#FEF2F2'],
  ['#7C3AED', '#F5F3FF'],
  ['#0891B2', '#E0F2FE'],
]

function UserAvatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const [fg, bg] = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
  return (
    <Avatar
      sx={{
        width: size, height: size, bgcolor: bg, color: fg,
        fontSize: size * 0.35, fontWeight: 700,
        fontFamily: '"Outfit", sans-serif',
        border: `1.5px solid ${fg}22`,
        flexShrink: 0,
      }}
    >
      {initials}
    </Avatar>
  )
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5,
        bgcolor: '#fff', border: '1px solid #E8E9F0',
        borderRadius: '10px', px: 2, py: 1.5, minWidth: 140,
        boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
      }}
    >
      <Box sx={{ color: '#4338CA', display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1, color: '#0F172A', fontFamily: '"Outfit", sans-serif' }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {label}
        </Typography>
      </Box>
    </Box>
  )
}

export default function UserListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce: fire query 350ms after user stops typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = searchInput.trim()

    if (trimmed === searchQuery) { setIsDebouncing(false); return }

    if (trimmed.length === 0) {
      setSearchQuery('')
      setPage(0)
      setIsDebouncing(false)
      return
    }

    if (trimmed.length === 1) { setIsDebouncing(false); return } // need ≥2 chars

    setIsDebouncing(true)
    debounceRef.current = setTimeout(() => {
      setSearchQuery(trimmed)
      setPage(0)
      setIsDebouncing(false)
    }, 350)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [searchInput]) // eslint-disable-line react-hooks/exhaustive-deps

  const queryKey = ['users', { page: page + 1, limit: rowsPerPage, q: searchQuery }]

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: () =>
      searchQuery
        ? usersApi.search(searchQuery, page + 1, rowsPerPage)
        : usersApi.getAll(page + 1, rowsPerPage),
    placeholderData: (prev) => prev,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      enqueueSnackbar('User removed successfully', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      setDeleteTarget(null)
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
      setDeleteTarget(null)
    },
  })

  const handleClear = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearchInput('')
    setSearchQuery('')
    setPage(0)
    setIsDebouncing(false)
  }
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Escape') handleClear() }

  const searching = isDebouncing || (isFetching && !!searchQuery)

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const total = data?.pagination.totalRecords ?? 0
  const activeUsers = data?.data.filter((u) => u.isActive).length ?? 0

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Fraunces", Georgia, serif',
                fontSize: '2rem',
                fontWeight: 300,
                fontStyle: 'italic',
                letterSpacing: '-0.03em',
                color: '#0F172A',
                lineHeight: 1.1,
                mb: 0.5,
              }}
            >
              User Directory
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              {isLoading ? 'Fetching records…' : `Manage and audit your organisation's identities`}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/users/new')}
            sx={{ mt: 0.5, px: 2.5 }}
          >
            Add User
          </Button>
        </Box>

        {/* Stat cards */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          <StatCard label="Total Users" value={isLoading ? '—' : total} icon={<PersonOutline fontSize="small" />} />
          <StatCard label="Active" value={isLoading ? '—' : activeUsers} icon={<EmailOutlined fontSize="small" />} />
          <StatCard label="Page" value={`${page + 1} of ${Math.max(1, data?.pagination.totalPages ?? 1)}`} icon={<PhoneOutlined fontSize="small" />} />
        </Stack>
      </Box>

      {/* Search bar */}
      <Paper sx={{ mb: 2, p: '10px 14px', display: 'flex', gap: 1, alignItems: 'center' }} elevation={0}>
        <TextField
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type to search name, email, PAN, Aadhaar, mobile…"
          size="small"
          fullWidth
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {searching
                  ? <CircularProgress size={15} thickness={5} sx={{ color: '#4338CA' }} />
                  : <Search sx={{ fontSize: 17, color: searchInput ? '#4338CA' : '#9499B0', transition: 'color 0.15s' }} />
                }
              </InputAdornment>
            ),
            endAdornment: searchInput ? (
              <InputAdornment position="end">
                <Tooltip title="Clear (Esc)" arrow>
                  <IconButton size="small" onClick={handleClear} sx={{ p: 0.25, color: '#9499B0', '&:hover': { color: '#374151' } }}>
                    <ClearRounded sx={{ fontSize: 15 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ) : null,
            sx: {
              transition: 'box-shadow 0.15s',
              ...(searchInput && { boxShadow: '0 0 0 3px rgba(67,56,202,0.08)' }),
            },
          }}
        />
        <Tooltip title="Refresh" arrow>
          <IconButton
            onClick={() => refetch()}
            size="small"
            disabled={isFetching}
            sx={{ color: '#9499B0', flexShrink: 0, '&:hover': { color: '#4338CA', bgcolor: '#EEF2FF' } }}
          >
            <Refresh sx={{ fontSize: 18, ...(isFetching && { animation: 'spin 1s linear infinite', '@keyframes spin': { to: { transform: 'rotate(360deg)' } } }) }} />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Active search badge */}
      {searchQuery && !isDebouncing && (
        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchOff sx={{ fontSize: 14, color: '#94A3B8' }} />
          <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.8125rem' }}>Results for</Typography>
          <Chip
            label={`"${searchQuery}"`}
            size="small"
            onDelete={handleClear}
            sx={{ bgcolor: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE', fontWeight: 600, height: 22, fontSize: '0.75rem' }}
          />
          {data && (
            <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              · {data.pagination.totalRecords} found
            </Typography>
          )}
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error).message}
        </Alert>
      )}

      {/* Data table */}
      <Paper elevation={0} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>PAN</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" sx={{ pr: '20px !important' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: rowsPerPage }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Skeleton variant="circular" width={36} height={36} />
                          <Box>
                            <Skeleton variant="text" width={120} height={16} />
                            <Skeleton variant="text" width={80} height={12} />
                          </Box>
                        </Stack>
                      </TableCell>
                      {[130, 100, 80, 80, 60].map((w, j) => (
                        <TableCell key={j}><Skeleton variant="text" width={w} /></TableCell>
                      ))}
                      <TableCell><Skeleton variant="rounded" width={70} height={28} sx={{ ml: 'auto' }} /></TableCell>
                    </TableRow>
                  ))
                : data?.data.map((user) => {
                    const fullName = `${user.firstName} ${user.lastName}`
                    return (
                      <TableRow key={user.id}>
                        <TableCell sx={{ minWidth: 200 }}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <UserAvatar name={fullName} />
                            <Box>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#0F172A', lineHeight: 1.3 }}>
                                {fullName}
                              </Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.3 }}>
                                {user.placeOfBirth}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ color: '#475569', fontSize: '0.8375rem' }}>
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem', color: '#475569', letterSpacing: '0.02em' }}>
                            {user.primaryMobile}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              bgcolor: '#F8F9FC',
                              border: '1px solid #E8E9F0',
                              borderRadius: '6px',
                              px: 1,
                              py: 0.375,
                            }}
                          >
                            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.775rem', fontWeight: 500, color: '#374151', letterSpacing: '0.04em' }}>
                              {user.panNumber}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: '#64748B', fontSize: '0.8375rem', whiteSpace: 'nowrap' }}>
                          {formatDate(user.dateOfBirth)}
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              borderRadius: '5px',
                              px: 1,
                              py: 0.375,
                              bgcolor: user.isActive ? '#ECFDF5' : '#F8F9FC',
                              border: `1px solid ${user.isActive ? '#A7F3D0' : '#E8E9F0'}`,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6, height: 6, borderRadius: '50%',
                                bgcolor: user.isActive ? '#10B981' : '#94A3B8',
                              }}
                            />
                            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: user.isActive ? '#065F46' : '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/users/${user.id}/edit`)}
                                sx={{
                                  width: 30, height: 30,
                                  color: '#4338CA', bgcolor: '#EEF2FF',
                                  border: '1px solid #C7D2FE',
                                  '&:hover': { bgcolor: '#E0E7FF', transform: 'scale(1.05)' },
                                }}
                              >
                                <Edit sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                size="small"
                                onClick={() => setDeleteTarget(user)}
                                sx={{
                                  width: 30, height: 30,
                                  color: '#DC2626', bgcolor: '#FEF2F2',
                                  border: '1px solid #FCA5A5',
                                  '&:hover': { bgcolor: '#FEE2E2', transform: 'scale(1.05)' },
                                }}
                              >
                                <Delete sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    )
                  })}

              {!isLoading && data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 8, textAlign: 'center', border: 0 }}>
                    <Box
                      sx={{
                        width: 52, height: 52, borderRadius: '14px',
                        bgcolor: '#F1F2F8', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', mx: 'auto', mb: 2,
                      }}
                    >
                      <PersonOutline sx={{ fontSize: 26, color: '#9499B0' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: '#374151', mb: 0.5 }}>
                      {searchQuery ? 'No results found' : 'No users yet'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', mb: searchQuery ? 0 : 2 }}>
                      {searchQuery ? `No records matching "${searchQuery}"` : 'Get started by adding your first user'}
                    </Typography>
                    {!searchQuery && (
                      <Button variant="contained" size="small" startIcon={<Add />} onClick={() => navigate('/users/new')}>
                        Add User
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete User"
        message={`Remove ${deleteTarget?.firstName} ${deleteTarget?.lastName} from the system? Their data is retained for audit compliance — this is a soft delete.`}
        confirmLabel="Delete"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  )
}
