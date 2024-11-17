using FluentValidation;
using Service.DTO.Transaction;

namespace Service.Validators;

public class UpdateTransactionDtoValidator : AbstractValidator<UpdateTransactionDto>
{
    public UpdateTransactionDtoValidator()
    {
        RuleFor(t => t.Amount).GreaterThan(0);
        RuleFor(t => t.MobilePayTransactionId).NotEmpty();
    }
}