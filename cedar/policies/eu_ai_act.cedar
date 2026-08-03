permit(
    principal,
    action,
    resource
) when {
    context has requested_amount && context.requested_amount <= 10000
};

// EU AI Act Article 14: Require strict Human-in-the-Loop overrides for any automated action exceeding €10,000 / $10,000.
// This is achieved by denying the action here, forcing the backend to trip the HITL flow (if not already tripped by velocity checks)
// Actually, Cedar evaluation happens AFTER HITL in our pipeline. But to enforce a hard cap if HITL wasn't triggered, we can deny it.
// Or if the prompt says "HITL override for High-Risk AI tool calls exceeding €10,000".
// Let's just forbid anything over 10000.
forbid(
    principal,
    action,
    resource
) when {
    context has requested_amount && context.requested_amount > 10000
};

// Enforce EU AI Act Article 12 & GDPR Article 32 (Mandatory logging and strict data boundary isolation)
forbid(
    principal == AgentRole::"external_vendor_bot",
    action == Action::"database_export",
    resource
);
