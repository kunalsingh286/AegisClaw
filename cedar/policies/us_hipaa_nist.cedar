// Allow basic actions for authorized agents
permit(
    principal,
    action,
    resource
);

// Admin can do anything
permit(
    principal == AgentRole::"admin",
    action,
    resource
);

// Enforce NIST AI RMF 1.0 tool-execution scope boundaries
// Block these actions for everyone except admin
forbid(
    principal,
    action in [Action::"database_deletion", Action::"bulk_user_export"],
    resource
) when {
    principal != AgentRole::"admin"
};

// Enforce HIPAA PHI protection policies
forbid(
    principal,
    action == Action::"phi_egress",
    resource
) when {
    resource != Endpoint::"/api/v1/secure/internal/phi_vault"
};
