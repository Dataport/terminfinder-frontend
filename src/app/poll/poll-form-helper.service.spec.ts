import {PollFormHelperService} from "./poll-form-helper.service";
import {TestBed} from "@angular/core/testing";
import {VotingStatusType} from "../shared/models";
import moment from "moment";
import {TranslateTestingModule} from "ngx-translate-testing";
import * as de from "../../locales/de-DE-du.json";

describe("PollFormHelperService", () => {
  let service: PollFormHelperService;

  beforeAll(() => {
    moment.locale("de");
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PollFormHelperService],
      imports: [TranslateTestingModule.withTranslations({de})],
    });
    service = TestBed.inject(PollFormHelperService);
  });

  it("should correctly generate and download a CSV file for a poll", () => {
    const createdDownloadAnchor = {
      click: jest.fn(),
    } as any as HTMLAnchorElement;

    jest
      .spyOn(document, "createElement")
      .mockReturnValue(createdDownloadAnchor);

    const encodeURIComponentMock = jest.spyOn(window, "encodeURIComponent");

    service.appointment.suggestedDates = [
      {
        suggestedDateId: "1",
        startDate: "2024-01-10T00:00:00.000Z",
        startTime: "2024-01-10T12:00:00.000Z",
        endDate: "2024-01-11T00:00:00.000Z",
        endTime: "2024-01-11T06:00:00.000Z",
        description: "description"
      },
      {
        suggestedDateId: "2",
        startDate: "2024-01-20T00:00:00.000Z",
        startTime: "2024-01-20T13:00:00.000Z",
        endDate: "",
        endTime: "2024-01-21T18:00:00.000Z",
        description: "a different description"
      },
    ];

    service.appointment.participants = [
      {
        participantId: "1",
        name: "John Doe",
        votings: [
          {
            suggestedDateId: "1",
            votingId: "1",
            status: VotingStatusType.Accepted,
          },
          {
            suggestedDateId: "2",
            votingId: "2",
            status: VotingStatusType.Declined,
          },
        ],
      },
      {
        participantId: "2",
        name: '"Doe", "Jane"',
        votings: [
          {
            suggestedDateId: "1",
            votingId: "3",
            status: VotingStatusType.Questionable,
          },
          {
            suggestedDateId: "2",
            votingId: "4",
            status: VotingStatusType.Undefined,
          },
        ],
      },
    ];
    service.appointment.title = "Title";
    service.downloadCsv();

    expect(createdDownloadAnchor.click).toHaveBeenCalled();
    expect(createdDownloadAnchor.download).toBe("Umfrage-Title.csv");
    expect(encodeURIComponentMock).toHaveBeenCalledWith(
      [
        'sep=,',
        `Teilnehmende,${moment("2024-01-10T12:00:00.000Z").format('MM/DD/YYYY [um] h:mm A')} bis ${moment("2024-01-11T06:00:00.000Z").format('MM/DD/YYYY [um] h:mm A')},${moment("2024-01-20T13:00:00.000Z").format('MM/DD/YYYY [um] h:mm A')} bis um ${moment("2024-01-21T18:00:00.000Z").format('h:mm A')}`,
        "John Doe,zugesagt,abgelehnt",
        '"""Doe"", ""Jane""",vorbehaltlich,unbekannt',
      ].join("\n"),
    );
  });
});
