import { PollFormHelperService } from './poll-form-helper.service';
import { TestBed } from '@angular/core/testing';
import { VotingStatusType } from '../shared/models';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import * as de from '../../locales/de-DE-du.json';

describe('PollFormHelperService', () => {
  let service: PollFormHelperService;
  let translateServiceMock: jest.Mocked<TranslateService>;

  beforeAll(() => {
    moment.locale('de');
  });

  beforeEach(() => {
    translateServiceMock = {
      instant: jest.fn(),
      get: jest.fn(),
      use: jest.fn(),
      setDefaultLang: jest.fn(),
      addLang: jest.fn(),
      removeLang: jest.fn(),
      getTranslation: jest.fn(),
      onLangChange: jest.fn(() => ({ subscribe: jest.fn() })),
      onTranslationLoad: jest.fn(() => ({ subscribe: jest.fn() })),
      onDefaultLangChange: jest.fn(() => ({ subscribe: jest.fn() }))
    } as unknown as jest.Mocked<TranslateService>;

    const getNestedValue = (obj: any, key: string): string | undefined => {
      const parts = key.split('.');
      let value: any = obj;
      for (const part of parts) {
        value = value?.[part];
        if (value === undefined) {
          return undefined;
        }
      }
      return typeof value === 'string' ? value : undefined;
    };

    translateServiceMock.instant.mockImplementation((key: string | string[], interpolateParams?: any) => {
      const resolveKey = (k: string): string => {
        let text = getNestedValue(de, k);

        if (text === undefined) {
          return k;
        }

        if (typeof text === 'string' && interpolateParams) {
          Object.keys(interpolateParams).forEach((paramKey) => {
            const placeholder = `{{${paramKey}}}`;
            const value = interpolateParams[paramKey];
            const stringValue = String(value);
            const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
            text = text.replace(regex, stringValue);
          });
        }

        return text;
      };

      if (Array.isArray(key)) {
        return key.map(resolveKey);
      }
      return resolveKey(key);
    });

    translateServiceMock.get.mockReturnValue({
      subscribe: (callback: (value: any) => void) => {
        setTimeout(() => callback(null), 0);
        return { unsubscribe: jest.fn() };
      },
      pipe: jest.fn()
    } as any);

    TestBed.configureTestingModule({
      providers: [
        PollFormHelperService,
        { provide: TranslateService, useValue: translateServiceMock }
      ]
    });

    service = TestBed.inject(PollFormHelperService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should correctly generate and download a CSV file for a poll', async () => {
    const createdDownloadAnchor = {
      click: jest.fn(),
      download: '',
      style: {},
      href: '',
      setAttribute: jest.fn()
    } as unknown as HTMLAnchorElement;

    jest.spyOn(document, 'createElement').mockReturnValue(createdDownloadAnchor);

    const encodeURIComponentMock = jest.spyOn(window, 'encodeURIComponent').mockImplementation((str) => str as any);

    service.appointment.suggestedDates = [
      {
        suggestedDateId: '1',
        startDate: '2024-01-10T00:00:00.000Z',
        startTime: '2024-01-10T12:00:00.000Z',
        endDate: '2024-01-11T00:00:00.000Z',
        endTime: '2024-01-11T06:00:00.000Z',
        description: 'description',
        hasVotings: true
      },
      {
        suggestedDateId: '2',
        startDate: '2024-01-20T00:00:00.000Z',
        startTime: '2024-01-20T13:00:00.000Z',
        endDate: '',
        endTime: '2024-01-21T18:00:00.000Z',
        description: 'a different description',
        hasVotings: true
      }
    ];

    service.appointment.participants = [
      {
        participantId: '1',
        name: 'John Doe',
        votings: [
          {
            suggestedDateId: '1',
            votingId: '1',
            status: VotingStatusType.Accepted
          },
          {
            suggestedDateId: '2',
            votingId: '2',
            status: VotingStatusType.Declined
          }
        ]
      },
      {
        participantId: '2',
        name: '"Doe", "Jane"',
        votings: [
          {
            suggestedDateId: '1',
            votingId: '3',
            status: VotingStatusType.Questionable
          },
          {
            suggestedDateId: '2',
            votingId: '4',
            status: VotingStatusType.Undefined
          }
        ]
      }
    ];
    service.appointment.title = 'Title';
    service.downloadCsv();

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(createdDownloadAnchor.click).toHaveBeenCalled();
    expect(createdDownloadAnchor.download).toBe('Umfrage-Title.csv');
    expect(encodeURIComponentMock).toHaveBeenCalledWith(
      [
        'sep=,',
        `Teilnehmende,${moment('2024-01-10T12:00:00.000Z').format('MM/DD/YYYY [um] h:mm A')} bis ${moment('2024-01-11T06:00:00.000Z').format('MM/DD/YYYY [um] h:mm A')},${moment('2024-01-20T13:00:00.000Z').format('MM/DD/YYYY [um] h:mm A')} bis um ${moment('2024-01-21T18:00:00.000Z').format('h:mm A')}`,
        'John Doe,zugesagt,abgelehnt',
        '"""Doe"", ""Jane""",vorbehaltlich,unbekannt'
      ].join('\n')
    );
  });
});
