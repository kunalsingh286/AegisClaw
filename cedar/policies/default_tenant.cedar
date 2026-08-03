permit(
    principal == AgentRole::"customer_servicing_bot",
    action == Action::"execute_refund",
    resource == Endpoint::"/api/v1/payments/refund"
) when {
    context.requested_amount <= 5000
};

forbid(
    principal == AgentRole::"customer_servicing_bot",
    action in [Action::"increase_credit_limit", Action::"execute_wire_transfer"],
    resource
);
