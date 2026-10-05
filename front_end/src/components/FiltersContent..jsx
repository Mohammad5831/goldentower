import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Drawer
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';


export default function FiltersContent () {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  return (
    <>
    {/* فیلتر قیمت */}
    <Box mb={3}>
      <Typography variant="h6">فیلتر قیمت</Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <TextField
          type="number"
          placeholder="از"
          value={filters.priceMin}
          onChange={(e) => handlePriceFilter('priceMin', e.target.value)}
          fullWidth
        />
        <TextField
          type="number"
          placeholder="تا"
          value={filters.priceMax}
          onChange={(e) => handlePriceFilter('priceMax', e.target.value)}
          fullWidth
        />
      </Box>
    </Box>

    {/* برند */}
    <Box mb={3}>
      <Typography variant="h6">برند</Typography>
      {brands.map((brand) => (
        <FormControlLabel
          key={brand}
          control={
            <Checkbox
              checked={filters.brands.includes(brand)}
              onChange={(e) =>
                handleFilterChange('brands', brand, e.target.checked)
              }
            />
          }
          label={brandTranslations[brand] || brand}
        />
      ))}
    </Box>

    {/* دسته‌بندی */}
    <Box mb={3}>
      <Typography variant="h6">دسته‌بندی</Typography>
      {categories.map((category) => (
        <FormControlLabel
          key={category}
          control={
            <Checkbox
              checked={filters.categories.includes(category)}
              onChange={(e) =>
                handleFilterChange('categories', category, e.target.checked)
              }
            />
          }
          label={category}
        />
      ))}
    </Box>

    {/* دکمه‌ها */}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      <Button onClick={clearFilters} variant="outlined">
        پاک کردن
      </Button>
      <Button
        variant="contained"
        onClick={() => setMobileFilterOpen(false)}
      >
        بستن
      </Button>
    </Box>
  </>
)
};