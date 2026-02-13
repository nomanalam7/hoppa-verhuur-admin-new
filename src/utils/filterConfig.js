export const FILTER_MODES = {
  DASHBOARD: "dashboard",
  ORDER_MANAGEMENT: "orderManagement",
  TENT_INVENTORY: "tentInventory",
  REPORTS: "reports",
};

export const FILTER_FIELD_TYPES = {
  SEARCH: "search",
  DATE: "date",
  DATE_RANGE: "dateRange",
  SELECT: "select",
};

export const filterConfigs = {
  [FILTER_MODES.DASHBOARD]: {
    fields: [
      {
        type: FILTER_FIELD_TYPES.SEARCH,
        id: "search",
        placeholder: "Naam, ID of Locatie",
        gridSize: { xs: 12, md: 9 },
      },
      {
        type: FILTER_FIELD_TYPES.SELECT,
        id: "status",
        placeholder: "Alle Status",
        gridSize: { xs: 12, md: 3 },
        options: [
          { value: "", label: "Alle Status" },
          { value: "Delivered", label: "Bezorgen" },
          { value: "Confirmed", label: "Bevestigd" },
          { value: "Picked Up", label: "Ophalen" },
          { value: "Planned", label: "Gepland" },
          { value: "Completed", label: "Voltooid" },
          { value: "Overdue", label: "Te laat" }
        ],
      },
    ],
  },

  [FILTER_MODES.ORDER_MANAGEMENT]: {
    fields: [
      {
        type: FILTER_FIELD_TYPES.SEARCH,
        id: "search",
        placeholder: "Naam, ID of Locatie",
        gridSize: { xs: 12, md: 8 },
      },
      {
        type: FILTER_FIELD_TYPES.DATE,
        id: "date",
        placeholder: "dd/mm/yyyy",
        gridSize: { xs: 12, md: 2 },
      },
      {
        type: FILTER_FIELD_TYPES.SELECT,
        id: "status",
        placeholder: "Alle Status",
        gridSize: { xs: 12, md: 2 },
        options: [
          { value: "", label: "Alle Status" },
          { value: "Delivered", label: "Bezorgen" },
          { value: "Confirmed", label: "Bevestigd" },
          { value: "Picked Up", label: "Ophalen" },
          { value: "Planned", label: "Gepland" },
          { value: "Completed", label: "Voltooid" },
          { value: "Overdue", label: "Te laat" }
        ],
      },
    ],
  },

  [FILTER_MODES.TENT_INVENTORY]: {
    fields: [
      {
        type: FILTER_FIELD_TYPES.SEARCH,
        id: "search",
        placeholder: "Zoeken op naam",
        gridSize: { xs: 12, md: 8 },
      },
      {
        type: FILTER_FIELD_TYPES.SELECT,
        id: "status",
        placeholder: "Alle Status",
        gridSize: { xs: 12, md: 2 },
        options: [
          { value: "", label: "Alle Status" },
          { value: "true", label: "Beschikbaar" },
          { value: "false", label: "Niet Beschikbaar" },
        ],

      },
      {
        type: FILTER_FIELD_TYPES.SELECT,
        id: "category",
        placeholder: "Alle Categorie",
        gridSize: { xs: 12, md: 2 },
        options: [
          { value: "", label: "Alle Categorie" }, // All Category
          { value: "Tents", label: "Tenten" }, // Tents
          { value: "Tables & Chairs", label: "Tafels & Stoelen" }, // Tables & Chair
          { value: "Party accessories", label: "Feestaccessoires" }, // Party accessories
          { value: "others", label: "Anderen" }, // Others
        ],
      },
    ],
  },

  [FILTER_MODES.REPORTS]: {
    fields: [
      {
        type: FILTER_FIELD_TYPES.SEARCH,
        id: "search",
        placeholder: "Naam, ID of Locatie",
        gridSize: { xs: 12, md: 9 },
      },
      {
        type: FILTER_FIELD_TYPES.DATE_RANGE,
        id: "dateRange",
        placeholder: "Selecteer een datum",
        gridSize: { xs: 12, md: 3 },
      },
    ],
  },
};

export const getFilterConfig = (mode) => {
  return filterConfigs[mode] || filterConfigs[FILTER_MODES.DASHBOARD];
};
