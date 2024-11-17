using FluentValidation;
using Service.DTO.Game;

public class UpdateGameDtoValidator : AbstractValidator<UpdateGameDto>
{
    public UpdateGameDtoValidator()
    {
        RuleFor(x => x.WinningSequence)
            .NotEmpty()
            .WithMessage("WinningSequence cannot be empty.");

        RuleFor(x => x.StartDate)
            .LessThan(x => x.EndDate)
            .When(x => x.EndDate.HasValue)
            .WithMessage("StartDate must be earlier than EndDate.");
    }
}