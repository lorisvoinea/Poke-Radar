use crate::domain::models::{NewMonitorProfile, UpdateMonitorProfile, ValidationError};

pub fn validate_new_profile(input: &NewMonitorProfile) -> Result<(), ValidationError> {
    validate_profile_payload(
        &input.name,
        input.min_margin_bps,
        input.fixed_cost_cents,
        input.variable_fee_bps,
        &input.product_ids,
    )
}

pub fn validate_update_profile(input: &UpdateMonitorProfile) -> Result<(), ValidationError> {
    validate_profile_payload(
        &input.name,
        input.min_margin_bps,
        input.fixed_cost_cents,
        input.variable_fee_bps,
        &input.product_ids,
    )
}

fn validate_profile_payload(
    name: &str,
    min_margin_bps: i64,
    fixed_cost_cents: i64,
    variable_fee_bps: i64,
    product_ids: &[i64],
) -> Result<(), ValidationError> {
    if name.trim().is_empty() {
        return Err(ValidationError::MissingField("name"));
    }
    if min_margin_bps < 0 {
        return Err(ValidationError::NegativeValue("min_margin_bps"));
    }
    if fixed_cost_cents < 0 {
        return Err(ValidationError::NegativeValue("fixed_cost_cents"));
    }
    if variable_fee_bps < 0 {
        return Err(ValidationError::NegativeValue("variable_fee_bps"));
    }
    if min_margin_bps > 100_000 {
        return Err(ValidationError::InvalidRange("min_margin_bps"));
    }
    if variable_fee_bps > 100_000 {
        return Err(ValidationError::InvalidRange("variable_fee_bps"));
    }
    if product_ids.is_empty() {
        return Err(ValidationError::EmptyProducts);
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::domain::models::{NewMonitorProfile, ValidationError};

    use super::validate_new_profile;

    #[test]
    fn rejects_negative_costs() {
        let payload = NewMonitorProfile {
            name: "Standard".to_string(),
            min_margin_bps: 1_500,
            fixed_cost_cents: -1,
            variable_fee_bps: 300,
            product_ids: vec![1],
            make_active: true,
        };

        let error = validate_new_profile(&payload).expect_err("validation should fail");
        assert_eq!(error, ValidationError::NegativeValue("fixed_cost_cents"));
    }

    #[test]
    fn rejects_missing_name() {
        let payload = NewMonitorProfile {
            name: " ".to_string(),
            min_margin_bps: 1_500,
            fixed_cost_cents: 90,
            variable_fee_bps: 300,
            product_ids: vec![1],
            make_active: true,
        };

        let error = validate_new_profile(&payload).expect_err("validation should fail");
        assert_eq!(error, ValidationError::MissingField("name"));
    }
}
