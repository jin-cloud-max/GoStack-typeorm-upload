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
  }: RequestDTO): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title },
    });

    if (category) throw new AppError('This category already exist');

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
      category,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
