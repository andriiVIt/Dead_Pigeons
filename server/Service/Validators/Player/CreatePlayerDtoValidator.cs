// using FluentValidation;
// using Service.DTO.Player;
//
// public class CreatePlayerDtoValidator : AbstractValidator<CreatePlayerDto>
// {
//     public CreatePlayerDtoValidator()
//     {
//         RuleFor(x => x.Name)
//             .NotEmpty().WithMessage("Name is required.")
//             .MaximumLength(100).WithMessage("Name must not exceed 100 characters.");
//
//         RuleFor(x => x.Balance)
//             .GreaterThanOrEqualTo(0).WithMessage("Balance must be 0 or greater.");
//
//         RuleFor(x => x.UserId)
//             .NotEmpty().WithMessage("UserId is required.");
//     }
// }