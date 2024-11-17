using FluentValidation;
using Service.DTO.Transaction;

namespace Service.Validators;

public class CreateTransactionDtoValidator : AbstractValidator<CreateTransactionDto>
{
    public CreateTransactionDtoValidator()
    {
        RuleFor(t => t.PlayerId).NotEmpty();
        RuleFor(t => t.Amount).GreaterThan(0);
        RuleFor(t => t.MobilePayTransactionId).NotEmpty();
    }
}