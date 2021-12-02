import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { verifySoftTag } from './verify-soft-tag';

jest.mock('child_process');
jest.mock('fs');

const execSyncMock = execSync as jest.Mock;
const readFileSyncMock = readFileSync as jest.Mock;
const makeStatusOuput = (data: Record<string, unknown>): Buffer =>
  Buffer.from(JSON.stringify(data), 'utf-8');

describe('#verifySoftTag', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an empty array if no components are created or modified', () => {
    const mockBitStatusJson = {
      newComponents: [],
      modifiedComponent: [],
      softTaggedComponents: [],
    };

    execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
    readFileSyncMock.mockReturnValueOnce(JSON.stringify({}));

    const errors = verifySoftTag();

    expect(errors).toEqual([]);
  });

  describe('new components', () => {
    it('should return a error if component is not tagged', () => {
      const mockBitStatusJson = {
        newComponents: [
          {
            name: 'new/component',
          },
        ],
        modifiedComponent: [],
        softTaggedComponents: [],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'new/component': {},
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(1);
    });

    it('should return a error if component is tagged without message', () => {
      const mockBitStatusJson = {
        newComponents: [
          {
            name: 'new/component',
          },
        ],
        modifiedComponent: [],
        softTaggedComponents: [],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'new/component': {
            nextVersion: {},
          },
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(1);
    });

    it('should not return an error if component is tagged with a message', () => {
      const mockBitStatusJson = {
        newComponents: [
          {
            name: 'new/component',
          },
        ],
        modifiedComponent: [],
        softTaggedComponents: [],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'new/component': {
            nextVersion: {
              message: 'test',
            },
          },
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(0);
    });
  });

  describe('updated components', () => {
    it('should return a error if component is not tagged', () => {
      const mockBitStatusJson = {
        newComponents: [],
        modifiedComponent: ['some.scope/modified/component@0.0.1'],
        softTaggedComponents: [],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'modified/component': {},
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(1);
    });

    it('should return a error if component is tagged without message', () => {
      const mockBitStatusJson = {
        newComponents: [],
        modifiedComponent: ['some.scope/modified/component@0.0.1'],
        softTaggedComponents: [],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'modified/component': {
            nextVersion: {},
          },
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(1);
    });

    it('should not return an error if component is tagged with a message', () => {
      const mockBitStatusJson = {
        newComponents: [],
        modifiedComponent: ['some.scope/modified/component@0.0.1'],
        softTaggedComponents: [],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'modified/component': {
            nextVersion: {
              message: 'test',
            },
          },
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(0);
    });
  });

  describe('staged components', () => {
    it('should return a error if component does not have a message', () => {
      const mockBitStatusJson = {
        newComponents: [],
        modifiedComponent: [],
        softTaggedComponents: ['modified/component'],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'modified/component': {
            nextVersion: {},
          },
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(1);
    });

    it('should not return a error if component has a message', () => {
      const mockBitStatusJson = {
        newComponents: [],
        modifiedComponent: [],
        softTaggedComponents: ['modified/component'],
      };

      execSyncMock.mockReturnValueOnce(makeStatusOuput(mockBitStatusJson));
      readFileSyncMock.mockReturnValueOnce(
        JSON.stringify({
          'modified/component': {
            nextVersion: {
              message: 'test',
            },
          },
        })
      );

      const errors = verifySoftTag();

      expect(errors.length).toBe(0);
    });
  });
});
