import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    let checkCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!checkCategory) {
      checkCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(checkCategory);
    }

    const transactionRepository = getCustomRepository(TransactionsRepository);

    if (type !== 'income' && type !== 'outcome')
      throw new AppError('It is not  valid type');

    const { total } = await transactionRepository.getBalance();

    if (total < value && type === 'outcome')
      throw new AppError('Insufficient funds');

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: checkCategory,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
