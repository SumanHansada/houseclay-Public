import {createSlice, type PayloadAction} from '@reduxjs/toolkit';

interface PropertySearchState {
  query: string;
  locality: string | null;
  propertyType: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
}

const initialState: PropertySearchState = {
  query: '',
  locality: null,
  propertyType: null,
  minPrice: null,
  maxPrice: null,
  bedrooms: null,
};

const propertySearchSlice = createSlice({
  name: 'propertySearch',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setFilters(
      state,
      action: PayloadAction<Partial<Omit<PropertySearchState, 'query'>>>,
    ) {
      return {...state, ...action.payload};
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {setSearchQuery, setFilters, resetFilters} =
  propertySearchSlice.actions;
export default propertySearchSlice.reducer;
