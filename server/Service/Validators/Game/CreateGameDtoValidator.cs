using FluentValidation;
using Service.DTO.Game;

namespace Service.Validators;

public class CreateGameDtoValidator : AbstractValidator<CreateGameDto>
{
    public CreateGameDtoValidator()
    {
        RuleFor(g => g.StartDate)
            .NotEmpty()
            .WithMessage("StartDate is required.");
        
        RuleFor(g => g.WinningSequence)
            .NotNull()
            .WithMessage("WinningSequence must not be null.");
    }
}