import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const checkTransaction = await transactionRepository.findOne(id);

    if (!checkTransaction) {
      throw new AppError('Transaction id invalid');
    }

    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
