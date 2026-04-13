use std::fmt;

#[derive(Debug, Clone)]
pub struct Product {
    pub id: i64,
    pub sku: String,
    pub title: String,
    pub created_at_utc: String,
}

#[derive(Debug, Clone)]
pub struct MonitorProfile {
    pub id: i64,
    pub name: String,
    pub min_margin_bps: i64,
    pub fixed_cost_cents: i64,
    pub variable_fee_bps: i64,
    pub is_active: bool,
    pub created_at_utc: String,
    pub updated_at_utc: String,
}

#[derive(Debug, Clone)]
pub struct NewMonitorProfile {
    pub name: String,
    pub min_margin_bps: i64,
    pub fixed_cost_cents: i64,
    pub variable_fee_bps: i64,
    pub product_ids: Vec<i64>,
    pub make_active: bool,
}

#[derive(Debug, Clone)]
pub struct UpdateMonitorProfile {
    pub id: i64,
    pub name: String,
    pub min_margin_bps: i64,
    pub fixed_cost_cents: i64,
    pub variable_fee_bps: i64,
    pub product_ids: Vec<i64>,
    pub make_active: bool,
}

#[derive(Debug, Clone)]
pub struct MonitorProfileWithProducts {
    pub profile: MonitorProfile,
    pub product_ids: Vec<i64>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ValidationError {
    MissingField(&'static str),
    NegativeValue(&'static str),
    InvalidRange(&'static str),
    EmptyProducts,
}

impl fmt::Display for ValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ValidationError::MissingField(field) => {
                write!(f, "Le champ `{field}` est obligatoire.")
            }
            ValidationError::NegativeValue(field) => {
                write!(f, "Le champ `{field}` ne peut pas être négatif.")
            }
            ValidationError::InvalidRange(field) => {
                write!(f, "Le champ `{field}` est hors bornes autorisées.")
            }
            ValidationError::EmptyProducts => {
                write!(f, "Sélectionnez au moins un produit surveillé.")
            }
        }
    }
}
