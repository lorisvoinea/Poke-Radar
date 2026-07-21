use crate::domain::models::{NewMonitorProfile, NewProduct, UpdateMonitorProfile, ValidationError};

pub fn validate_new_product(
    reference_id: Option<String>,
    sku: Option<String>,
    title: Option<String>,
) -> Result<NewProduct, ValidationError> {
    if reference_id.as_ref().is_some_and(|v| v.trim().is_empty()) {
        return Err(ValidationError::MissingField("reference_id"));
    }
    let reference_id = reference_id
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty());
    let sku = sku
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty());
    let title = title
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty());

    match (reference_id, sku, title) {
        (Some(reference_id), None, None) => Ok(NewProduct::Reference { reference_id }),
        (None, Some(sku), Some(title)) => Ok(NewProduct::FreeText { sku, title }),
        (None, Some(_), None) => Err(ValidationError::MissingField("title")),
        (None, None, Some(_)) => Err(ValidationError::MissingField("sku")),
        _ => Err(ValidationError::AmbiguousProductMode),
    }
}

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
    use crate::domain::models::{NewMonitorProfile, NewProduct, ValidationError};

    use super::{validate_new_product, validate_new_profile};

    #[test]
    fn accepts_exactly_one_product_creation_mode() {
        assert_eq!(
            validate_new_product(Some("ref-1".into()), None, None),
            Ok(NewProduct::Reference {
                reference_id: "ref-1".into()
            })
        );
        assert_eq!(
            validate_new_product(None, Some("SKU".into()), Some("Titre".into())),
            Ok(NewProduct::FreeText {
                sku: "SKU".into(),
                title: "Titre".into()
            })
        );
    }

    #[test]
    fn persists_product_values_after_trimming_validated_whitespace() {
        assert_eq!(
            validate_new_product(Some("  ref-1  ".into()), None, None),
            Ok(NewProduct::Reference {
                reference_id: "ref-1".into()
            })
        );
        assert_eq!(
            validate_new_product(
                None,
                Some("  SKU-1  ".into()),
                Some("  Carte locale  ".into())
            ),
            Ok(NewProduct::FreeText {
                sku: "SKU-1".into(),
                title: "Carte locale".into()
            })
        );
    }

    #[test]
    fn rejects_ambiguous_or_incomplete_product_payloads() {
        assert_eq!(
            validate_new_product(
                Some("ref-1".into()),
                Some("SKU".into()),
                Some("Titre".into())
            ),
            Err(ValidationError::AmbiguousProductMode)
        );
        assert_eq!(
            validate_new_product(None, Some("SKU".into()), None),
            Err(ValidationError::MissingField("title"))
        );
        assert_eq!(
            validate_new_product(None, None, Some("Titre".into())),
            Err(ValidationError::MissingField("sku"))
        );
    }

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
