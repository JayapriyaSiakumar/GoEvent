import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  filteredEvents: [],

  filters: {
    category: "",
    location: "",
    priceRange: [0, 10000],
    date: null,
    search: "",
  },
};

const applyFilters = (events, filters) => {
  console.log(filters);
  return events.filter((event) => {
    /* CATEGORY */
    const matchCategory =
      !filters.category ||
      event.category?.toLowerCase() === filters.category.toLowerCase();

    /* LOCATION */
    const matchLocation =
      !filters.location ||
      event.location?.address === filters.location ||
      event.location?.city === filters.location;

    /* PRICE (from tickets array) */
    const matchPrice =
      !event.tickets?.length ||
      event.tickets.some((ticket) => {
        const price = Number(ticket.price || 0);
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });

    /* DATE (compare with startDate) */
    const matchDate =
      !filters.date ||
      new Date(event.startDate).toISOString().slice(0, 10) === filters.date;

    /* SEARCH */
    const matchSearch =
      !filters.search ||
      event.title?.toLowerCase().includes(filters.search.toLowerCase());

    return (
      matchCategory && matchLocation && matchPrice && matchDate && matchSearch
    );
  });
};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
      state.filteredEvents =
        action.payload; /* applyFilters(action.payload, state.filters) */
    },

    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredEvents = applyFilters(state.events, state.filters);
    },

    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredEvents = state.events;
    },
  },
});

export const { setEvents, setFilter, clearFilters } = eventSlice.actions;

export default eventSlice.reducer;
