use std::path::Path;

use log::info;

use crate::infrastructure::db::{initialize_database, DbError, DbErrorKind};

/// `enum` définit un type somme: une valeur est soit `Ready`, soit `Blocked(String)`.
/// C'est pratique pour modéliser explicitement les états possibles d'un boot.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum BootState {
    Ready,
    Blocked(String),
}

/// Lance la séquence d'initialisation et convertit les erreurs DB en état lisible.
pub fn run_boot_sequence(db_path: &Path) -> BootState {
    info!("Boot app: démarrage de l'initialisation");

    // `match` force à traiter tous les cas (`Ok` et `Err`), ce qui évite les oublis.
    match initialize_database(db_path) {
        Ok(()) => {
            info!("Boot app: ouverture DB et migrations réussies");
            BootState::Ready
        }
        Err(error) => {
            info!("Boot app: échec d'initialisation critique: {error}");
            BootState::Blocked(actionable_error_message(error))
        }
    }
}

/// Transforme une erreur technique (`DbError`) en consigne actionnable pour l'utilisateur.
fn actionable_error_message(error: DbError) -> String {
    match error.kind() {
        DbErrorKind::CorruptOrInvalid => "Initialisation impossible: la base de données locale est corrompue ou invalide. Restaurez une sauvegarde ou contactez le support."
            .to_string(),
        DbErrorKind::Permission => "Initialisation impossible. Vérifiez les permissions du dossier de données, puis relancez l'application."
            .to_string(),
        DbErrorKind::Busy => "La base de données est temporairement verrouillée. Réessayez dans quelques instants."
            .to_string(),
        DbErrorKind::Other => "Initialisation impossible: la mise à jour des données locales a échoué. Relancez l'application; si le problème persiste, contactez le support."
            .to_string(),
    }
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use rusqlite::{
        ffi::{Error as FfiError, ErrorCode},
        Error as SqlError,
    };

    use super::{actionable_error_message, DbError};

    #[test]
    fn boot_error_does_not_expose_sqlite_paths() {
        let message = actionable_error_message(DbError::Open(SqlError::InvalidPath(
            PathBuf::from("/private/user/database.sqlite"),
        )));

        assert!(message.contains("Vérifiez les permissions"));
        assert!(!message.contains("/private/user/database.sqlite"));
        assert!(!message.contains("database open error"));
    }

    #[test]
    fn migration_failure_has_recovery_guidance_instead_of_permission_advice() {
        let message = actionable_error_message(DbError::Migration {
            migration: "004_correct_product_reference_seed".to_string(),
            source: SqlError::InvalidQuery,
        });

        assert!(message.contains("mise à jour des données locales"));
        assert!(message.contains("contactez le support"));
        assert!(!message.contains("permissions"));
        assert!(!message.contains("004_correct_product_reference_seed"));
    }

    #[test]
    fn non_sqlite_database_has_corruption_guidance_instead_of_permission_advice() {
        let message = actionable_error_message(DbError::Open(SqlError::SqliteFailure(
            FfiError {
                code: ErrorCode::NotADatabase,
                extended_code: 26,
            },
            Some("file is not a database: /private/user/database.sqlite".to_string()),
        )));

        assert!(message.contains("corrompue ou invalide"));
        assert!(message.contains("sauvegarde"));
        assert!(!message.contains("permissions"));
        assert!(!message.contains("/private/user/database.sqlite"));
        assert!(!message.contains("file is not a database"));
    }
}
