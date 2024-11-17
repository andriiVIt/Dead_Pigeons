using Service.DTO.Transaction;
 

namespace Service.Interfaces;

public interface ITransactionService
{
    GetTransactionDto CreateTransaction(CreateTransactionDto createTransactionDto);
    GetTransactionDto UpdateTransaction(Guid id, UpdateTransactionDto updateTransactionDto);
    GetTransactionDto? GetTransactionById(Guid id);
    List<GetTransactionDto> GetAllTransactions(int limit, int startAt);
    bool DeleteTransaction(Guid id);
}