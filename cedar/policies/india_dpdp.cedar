// India DPDP & RBI Compliance Policy

// Allow normal operations by default if requested amount is under the RBI micro-transaction limit (₹5,000)
permit(
    principal,
    action,
    resource
) when {
    context has requested_amount && context.requested_amount <= 5000
};

// Enforce RBI strict limitations for any automated fund transfers exceeding ₹5,000
forbid(
    principal,
    action,
    resource
) when {
    context has requested_amount && context.requested_amount > 5000
};

// Enforce DPDP Data Residency: Block unauthorized data exports
forbid(
    principal == AgentRole::"external_vendor_bot",
    action == Action::"database_export",
    resource
);
