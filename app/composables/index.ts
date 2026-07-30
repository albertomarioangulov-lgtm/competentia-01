// ============================================================
// Modelos de Mongoose - Registro centralizado
// ============================================================
// Este archivo importa todos los modelos para que Mongoose los
// registre al iniciar la aplicación. Esto es crítico para evitar
// el error "MissingSchemaError: Schema hasn't been registered"
// en entornos serverless (Cloud Run) con cold starts.
// ============================================================

import './User'
import './Client'
import './Garment'
import './Order'
import './Visit'
import './Route'
import './Location'
import './InventoryMovement'
