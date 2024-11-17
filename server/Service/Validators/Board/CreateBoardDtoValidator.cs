namespace Service.Validators.Board;

using FluentValidation;
using Service.DTO.Board;

public class CreateBoardDtoValidator : AbstractValidator<CreateBoardDto>
{
    public CreateBoardDtoValidator()
    {
        RuleFor(b => b.PlayerId).NotEmpty().WithMessage("PlayerId is required.");
        RuleFor(b => b.GameId).NotEmpty().WithMessage("GameId is required.");
        RuleFor(b => b.Numbers).NotEmpty().WithMessage("Numbers cannot be empty.");
    }
}