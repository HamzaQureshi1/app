import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { prismaClient } from '../src/index.js';
import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
  listAppointments,
  viewMyAppointments,
} from '../src/controllers/appointments.js';
import { NotFoundException } from '../src/exceptions/not-found.js';
import httpMocks from 'node-mocks-http';

vi.mock('../src/index.js', () => ({
  prismaClient: {
    appointments: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe('Appointment Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.user = { id: 1 }; // Mock logged-in user ID
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test: createAppointment
  describe('createAppointment', () => {
    it('should create a new appointment and return it', async () => {
      const mockAppointment = { id: 1, job_centre_id: 123, date: '2024-12-24', address: '123 Main St', benefit_name: 'Benefit A' };
      req.body = mockAppointment;

      prismaClient.appointments.create.mockResolvedValue(mockAppointment);

      await createAppointment(req, res);

      expect(prismaClient.appointments.create).toHaveBeenCalledWith({
        data: {
          ...req.body,
          customer_id: req.user.id,
        },
      });

      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data).toEqual(mockAppointment);
    });
  });

  // Test: updateAppointment
  describe('updateAppointment', () => {
    it('should update an existing appointment and return it', async () => {
      const mockUpdatedAppointment = { id: 1, job_centre_id: 123, date: '2024-12-25' };
      req.params.id = '1';
      req.body = mockUpdatedAppointment;

      prismaClient.appointments.update.mockResolvedValue(mockUpdatedAppointment);

      await updateAppointment(req, res);

      expect(prismaClient.appointments.update).toHaveBeenCalledWith({
        where: { appointment_id: 1 },
        data: req.body,
      });

      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data).toEqual(mockUpdatedAppointment);
    });

    it('should throw a NotFoundException if the appointment is not found', async () => {
      req.params.id = '999';
      prismaClient.appointments.update.mockRejectedValue({ code: 'P2025' });

      await expect(updateAppointment(req, res)).rejects.toThrow(NotFoundException);

      expect(prismaClient.appointments.update).toHaveBeenCalledWith({
        where: { appointment_id: 999 },
        data: req.body,
      });
    });
  });

  // Test: deleteAppointment
  describe('deleteAppointment', () => {
    it('should delete an appointment and return success message', async () => {
      req.params.id = '1';
      const mockDeletedAppointment = { id: 1 };

      prismaClient.appointments.delete.mockResolvedValue(mockDeletedAppointment);

      await deleteAppointment(req, res);

      expect(prismaClient.appointments.delete).toHaveBeenCalledWith({
        where: { appointment_id: 1 },
      });

      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data).toEqual({
        message: 'Appointment deleted successfully',
        deletedAppointment: mockDeletedAppointment,
      });
    });

    it('should throw a NotFoundException if the appointment is not found', async () => {
      req.params.id = '999';
      prismaClient.appointments.delete.mockRejectedValue({ code: 'P2025' });

      await expect(deleteAppointment(req, res)).rejects.toThrow(NotFoundException);

      expect(prismaClient.appointments.delete).toHaveBeenCalledWith({
        where: { appointment_id: 999 },
      });
    });
  });

  // Test: listAppointments
  describe('listAppointments', () => {
    it('should return a list of appointments with count', async () => {
      const mockAppointments = [{ id: 1 }, { id: 2 }];
      prismaClient.appointments.count.mockResolvedValue(2);
      prismaClient.appointments.findMany.mockResolvedValue(mockAppointments);

      await listAppointments(req, res);

      expect(prismaClient.appointments.count).toHaveBeenCalled();
      expect(prismaClient.appointments.findMany).toHaveBeenCalledWith({
        skip: req.query.skip || 0,
        take: 20,
      });

      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data).toEqual({ count: 2, data: mockAppointments });
    });
  });

  // Test: viewMyAppointments
  describe('viewMyAppointments', () => {
    it('should return a list of appointments for the logged-in user', async () => {
      const mockAppointments = [{ id: 1, customer_id: 1 }, { id: 2, customer_id: 1 }];

      prismaClient.appointments.findMany.mockResolvedValue(mockAppointments);

      await viewMyAppointments(req, res);

      expect(prismaClient.appointments.findMany).toHaveBeenCalledWith({
        where: { customer_id: req.user.id },
      });

      const data = res._getJSONData();
      expect(res.statusCode).toBe(200);
      expect(data).toEqual({ data: mockAppointments });
    });
  });
});