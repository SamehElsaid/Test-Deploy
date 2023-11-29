// ** MUI Import
import Box from '@mui/material/Box'

// ** Custom Component Imports
import CustomTextField from 'src/@core/components/mui/text-field'
import CustomAutocomplete from 'src/@core/components/mui/autocomplete'

// ** Data
import { countries } from 'src/@fake-db/autocomplete'
import { margin } from '@mui/system'

const AutocompleteCountry = () => {
  return (
    <CustomAutocomplete
      sx={{ marginTop: '-19px' }}
      autoHighlight
      id='autocomplete-country-select'
      options={countries}
      autoWidth
      getOptionLabel={option => '+' + option.phone || ''}
      renderOption={(props, option) => (
        <Box component='li' autoWidth sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
          <img
            alt=''
            width='20'
            loading='lazy'
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
          />
          {option.label} ({option.code}) +{option.phone}
        </Box>
      )}
      renderInput={params => (
        <CustomTextField
          autoWidth
          {...params}
          label='Phone No.'
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password'
          }}
        />
      )}
    />
  )
}

export default AutocompleteCountry
